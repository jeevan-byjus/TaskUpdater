# ExcelTaskUpdater
A simple task updater which updates daily tasks in excel through CLI

**Why?**
- The task updater is huge, takes weird amount of time to load, and weird amount of time to update values in that.
- A command line tool is waaaay faster, plus fun!

**How it works?**
- This is a command line tool. 
- You specify parameters like what task you did, meetings attended, status.
- The tool adds in other parameters like date, name, TNL etc., finds the last available row in the sheet and updates this row there.

**Steps:**
- Install NodeJS - https://nodejs.org/en/download/
- Open index.js in TextEditor and update the parameters according to you.

  - Find the variable called `resource`. Update your name, TNL and role here.

  - **Optional**:
    Find the variable called `questions`. This field is used to display on terminal. The main field of interest is the `default` key where you can update default values for a field.

- Open this project in terminal.
- Execute command `node index.js`

  - The first time, it'll ask for authentication. Follow the steps as required.
  - Next time onwards, it won't need authentication and directly go to json setup.
  - Some parameters (like project) have a default value which will be shown in `[]` next to the prompt. Press enter to choose default.

- Press enter after all values are updated and voila! :)
