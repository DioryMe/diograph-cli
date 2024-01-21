from robot.api.deco import keyword
from subprocess import run, PIPE

@keyword("Run Dcli Command")
def run_dcli_command(command):
    result = run(["dcli"] + command.split(), stdout=PIPE, stderr=PIPE, text=True)
    return result.stdout
