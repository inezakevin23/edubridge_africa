from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """
    Standard pagination used throughout the project.
    """

    page_size = 8
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):

        from .responses import api_response

        return api_response(
            success=True,
            message="Data retrieved successfully.",
            data={
                "count": self.page.paginator.count,
                "page": self.page.number,
                "pages": self.page.paginator.num_pages,
                "page_size": self.get_page_size(self.request),
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            },
        )