from robot.api.deco import keyword
from subprocess import run, PIPE
import shlex

@keyword("Run Dcli Command")
def run_dcli_command(command):
    result = run(["dcli"] + shlex.split(command), stdout=PIPE, stderr=PIPE, text=True)
    return result.returncode, result.stdout, result.stderr
