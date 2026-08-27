@REM Maven Wrapper startup batch script
@setlocal

set "DIR=%~dp0"
"%DIR%maven\apache-maven-3.9.8\bin\mvn.cmd" %*

if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
