"""
Custom Supabase storage backend for Django.
Uses the official supabase-py client directly.
"""
import os
from django.core.files.base import ContentFile
from django.core.files.storage import Storage
from django.conf import settings
from supabase import create_client, Client


class SupabaseStorage(Storage):
    """Custom storage backend for Supabase."""
    
    def __init__(self):
        self.supabase_url = getattr(settings, 'SUPABASE_URL', None)
        self.supabase_key = getattr(settings, 'SUPABASE_KEY', None)
        self.bucket_name = getattr(settings, 'SUPABASE_BUCKET', 'edubridge_media_bucket')
        
        if not all([self.supabase_url, self.supabase_key]):
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be configured")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
    
    def _open(self, name, mode='rb'):
        """Returns file object from Supabase storage."""
        try:
            response = self.supabase.storage.from_(self.bucket_name).download(name)
            return ContentFile(response)
        except Exception as e:
            raise IOError(f"Error opening file {name}: {e}")
    
    def _save(self, name, content):
        """Saves file to Supabase storage."""
        try:
            # Read the content
            if hasattr(content, 'chunks'):
                file_data = b''.join(chunk for chunk in content.chunks())
            else:
                file_data = content.read()
            
            # Upload to Supabase
            self.supabase.storage.from_(self.bucket_name).upload(
                path=name,
                file=file_data,
                file_options={"content-type": content.content_type if hasattr(content, 'content_type') else "application/octet-stream"}
            )
            return name
        except Exception as e:
            raise IOError(f"Error saving file {name}: {e}")
    
    def delete(self, name):
        """Deletes file from Supabase storage."""
        try:
            self.supabase.storage.from_(self.bucket_name).remove([name])
        except Exception as e:
            raise IOError(f"Error deleting file {name}: {e}")
    
    def exists(self, name):
        """Check if file exists in Supabase storage."""
        try:
            result = self.supabase.storage.from_(self.bucket_name).list()
            return any(item['name'] == name for item in result)
        except Exception:
            return False
    
    def url(self, name):
        """Returns public URL for the file."""
        try:
            # Generate signed URL valid for 1 hour
            response = self.supabase.storage.from_(self.bucket_name).create_signed_url(name, 3600)
            # supabase-py returns a dict with 'signedURL' key
            if isinstance(response, dict) and 'signedURL' in response:
                return response['signedURL']
            return response
        except Exception as e:
            # Return None instead of raising an error if URL generation fails
            # This prevents crashes when old files don't exist
            return None
    
    def size(self, name):
        """Returns file size."""
        try:
            files = self.supabase.storage.from_(self.bucket_name).list()
            for file in files:
                if file['name'] == name:
                    return file['metadata']['size']
            return 0
        except Exception:
            return 0
    
    def listdir(self, path):
        """Lists files in the given path."""
        try:
            files = self.supabase.storage.from_(self.bucket_name).list(path)
            return ([], [f['name'] for f in files])
        except Exception:
            return ([], [])