#!/bin/sh

# Activate the virtual environment
source /var/app/venv/staging-LQM1lest/bin/activate

# Migrate the database
python /var/app/current/manage.py migrate

python /var/app/current/manage.py createcachetable

# Collect static files
python /var/app/current/manage.py collectstatic --noinput


















