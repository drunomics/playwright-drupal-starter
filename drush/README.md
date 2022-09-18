This directory contains custom drush commands.
To include them, add the following to your composer.json
```json
{
  "autoload": {
    "psr-4": {
      "Drush\\Commands\\playwright_commands\\": "drush/Commands/custom/playwright_commands/src"
    }
  }
}
```