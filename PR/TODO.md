
### TODO: Solve this error caused by uploading multiple files too quickly:
``` python
    2022-07-19 11:06:12,072 - octoprint - ERROR - Exception on /api/files/local [POST]
    Traceback (most recent call last):
    File "C:\Program Files\Python310\lib\shutil.py", line 813, in move
        os.rename(src, real_dst)
    FileExistsError: [WinError 183] Cannot create a file when that file already exists: 'C:\\Users\\KESTIN~1\\AppData\\Local\\Temp\\octoprint-file-upload-mjtbxsei.tmp' -> 'C:\\Users\\Kestin Goforth\\AppData\\Roaming\\OctoPrint\\uploads\\Test File - SuperSlicer.gcode'

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
    File "C:\Users\Kestin Goforth\Documents\Code\OctoPrint\venv\lib\site-packages\flask\app.py", line 2077, in wsgi_app
        response = self.full_dispatch_request()
    File "C:\Users\Kestin Goforth\Documents\Code\OctoPrint\venv\lib\site-packages\flask\app.py", line 1525, in full_dispatch_request
        rv = self.handle_user_exception(e)
    File "C:\Users\Kestin Goforth\Documents\Code\OctoPrint\venv\lib\site-packages\flask\app.py", line 1523, in full_dispatch_request
        rv = self.dispatch_request()
    File "C:\Users\Kestin Goforth\Documents\Code\OctoPrint\venv\lib\site-packages\flask\app.py", line 1509, in dispatch_request
        return self.ensure_sync(self.view_functions[rule.endpoint])(**req.view_args)
    File "c:\users\kestin goforth\documents\code\octoprint\src\octoprint\server\util\flask.py", line 1508, in decorated_view
        return func(*args, **kwargs)
    File "c:\users\kestin goforth\documents\code\octoprint\src\octoprint\vendor\flask_principal.py", line 199, in _decorated
        rv = f(*args, **kw)
    File "c:\users\kestin goforth\documents\code\octoprint\src\octoprint\server\api\files.py", line 656, in uploadGcodeFile
        added_file = fileManager.add_file(
    File "c:\users\kestin goforth\documents\code\octoprint\src\octoprint\filemanager\__init__.py", line 727, in add_file
        path_in_storage = self._storage(destination).add_file(
    File "c:\users\kestin goforth\documents\code\octoprint\src\octoprint\filemanager\storage.py", line 895, in add_file
        file_object.save(file_path)
    File "c:\users\kestin goforth\documents\code\octoprint\src\octoprint\filemanager\util.py", line 66, in save
        shutil.move(self.path, path)
    File "C:\Program Files\Python310\lib\shutil.py", line 833, in move
        copy_function(src, real_dst)
    File "C:\Program Files\Python310\lib\shutil.py", line 434, in copy2
        copyfile(src, dst, follow_symlinks=follow_symlinks)
    File "C:\Program Files\Python310\lib\shutil.py", line 256, in copyfile
        with open(dst, 'wb') as fdst:
    OSError: [Errno 22] Invalid argument: 'C:\\Users\\Kestin Goforth\\AppData\\Roaming\\OctoPrint\\uploads\\Test File - SuperSlicer.gcode'
```
