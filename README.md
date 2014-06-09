#Copyright Notice

VERN is copyright 2014 uh-sem-blee, Co. Built by typefoo.

#License

You may not use, alter, or redistribute this code without permission from uh-sem-blee, Co.

# VERN Command Line Interface (CLI)

Vern module and project management

## Install

For the library

`npm install vern-core`

For the CLI tool

`npm install -g vern-cli`

## Getting Started

`vern <create|install|package|deploy|config> <options, ...>`

## Create

`vern create <project|container|controller|model|view|directive|service|filter>`

### Create a Project

`vern create project <path>` - path can be `.` for creating a project in the current directory

This will take you through a simple process that allows you to install all the dependencies as well. You can choose to do this later, it will also check if dependencies have been installed when starting the servers.

### Start a Project Server

`vern start <api|frontend|admin|all>` - starts the specified server component or all of them. Use CTRL+C to exit.

*TODO: Use forever or nodemon to watch file directories for updates*

### Create a Container

`vern create container <name>`

### Create a View

`vern create view <admin|frontend> <name>`

### Create a Controller

`vern create controller <name>`

### Create a Model

`vern create model <name>` - Should allow you to configure some stuff

### Create a Directive

`vern create directive <admin|frontend> <name>`

### Create a Service

`vern create service <admin|frontend> <name>`

### Create a Filter

`vern create filter <admin|frontend> <name>`