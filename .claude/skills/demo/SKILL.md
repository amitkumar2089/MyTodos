---
name: demo
description: This skill is used to create file with system time.
argument-hint: Enter the name of file
---
MSG = The current time is !`echo %time%

## Your task
if an argument is not provided while invoking the skill, use demo.txt as the default value.
Create a file by name $ARGUMENTS[0] in root directory of workspace and write to it MSG