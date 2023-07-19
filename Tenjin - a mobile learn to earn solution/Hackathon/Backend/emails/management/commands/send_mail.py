import time
from django.core.management.base import BaseCommand

from emails.models import Email


class Command(BaseCommand):
    help = 'Send Mails'

    def handle(self, *args, **options):
        while True:
            time.sleep(3)
            emails = Email.objects.filter(is_sent=False)
            for email in emails:
                email.send()
