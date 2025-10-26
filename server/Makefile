VENV:=.venv
PYTHON:=$(VENV)/bin/python
PIP:=$(VENV)/bin/pip

.PHONY: install migrate runserver test seed

install:
	python3 -m venv $(VENV)
	$(PIP) install -r requirements.txt

migrate:
	$(PYTHON) manage.py migrate

runserver:
	$(PYTHON) manage.py runserver 0.0.0.0:8000

seed:
	$(PYTHON) manage.py seed_demo

test:
	$(PYTHON) manage.py test
