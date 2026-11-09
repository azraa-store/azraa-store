Python inventory CLI (standalone, stdlib only, separate from the frontend):

```bash
cd inventory
python manage.py seed
python manage.py view "Round Neck"
python manage.py set "Round Neck T-Shirt" White M 120
python manage.py order   round-neck-t-shirt White M 5 --ref AZ10001
python manage.py restore round-neck-t-shirt White M 5 --ref AZ10001
python manage.py unavailable leather-bags
python manage.py history
```
