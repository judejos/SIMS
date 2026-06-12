# Migrations Backup

Store copies of Django migration files here as backup.

To backup current migrations:
```
xcopy /E /I backend\apps\*\migrations database\migrations_backup\
```

To restore:
```
xcopy /E /I database\migrations_backup\* backend\apps\
```
