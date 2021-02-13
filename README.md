# vscode-class-nav

## Features

* jump into class quotes last position
* jump into upper line class quotes
* jump into lover line class quotes


Basic plugin for HTML class navigation

## Commands

* `class-navigation.jumpUpToClass` : jump into upper line class quotes
* `class-navigation.jumpDownToClass` : jump into lover line class quotes
* `class-navigation.jumpIntoClass`:  jump into class quotes last position

```json
 {
        "key": "ctrl+up",
        "command": "class-navigation.jumpUpToClass",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+down",
        "command": "class-navigation.jumpDownToClass",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+right",
        "command": "class-navigation.jumpIntoClass",
        "when": "editorTextFocus"
    }
```

Gif
![alt text](https://github.com/vaclavbenes/vscode-class-nav/blob/master/img/class-nav.gif "Class Navigation")

