"""
Helper functions for working with version control systems.
https://github.com/cookiecutter/cookiecutter/blob/cf81d63bf3d82e1739db73bcbed6f1012890e33e/cookiecutter/vcs.py
"""

__copyright__ = "Copyright 2022, Audrey Roy Greenfeld"
__license__ = "BSD-3-Clause"

import logging
import os
import subprocess  # nosec
from shutil import which
from tempfile import TemporaryDirectory
from typing import Optional

from cookiecutter.exceptions import (
    RepositoryCloneFailed,
    RepositoryNotFound,
    VCSNotInstalled,
)

logger = logging.getLogger(__name__)


BRANCH_ERRORS = [
    "error: pathspec",
    "unknown revision",
]


def is_vcs_installed(repo_type):
    """
    Check if the version control system for a repo type is installed.

    :param repo_type:
    """
    return bool(which(repo_type))


def clone_repo(
    repo_url: str,
    clone_to_dir: TemporaryDirectory,
    checkout: Optional[str] = None,
):
    """Clone a repo to the current directory.

    :param repo_url: Repo URL of unknown type.
    :param clone_to_dir: The temporary directory to clone to.
    :param checkout: The branch, tag or commit ID to checkout after clone.
    :returns: str with path to the new directory of the repository.
    """

    # check that the appropriate VCS for the repo_type is installed
    if not is_vcs_installed("git"):
        msg = "Git is not installed."
        raise VCSNotInstalled(msg)

    repo_url = repo_url.rstrip("/")
    repo_name = os.path.split(repo_url)[1]
    repo_name = repo_name.split(":")[-1].rsplit(".git")[0]
    repo_dir = os.path.normpath(os.path.join(clone_to_dir.name, repo_name))
    logger.debug(f"repo_dir is {repo_dir}")

    try:
        subprocess.check_output(  # nosec
            ["git", "clone", repo_url],
            cwd=clone_to_dir.name,
            stderr=subprocess.STDOUT,
        )
        if checkout is not None:
            checkout_params = [checkout]
            subprocess.check_output(  # nosec
                ["git", "checkout", *checkout_params],
                cwd=repo_dir,
                stderr=subprocess.STDOUT,
            )
    except subprocess.CalledProcessError as clone_error:
        output = clone_error.output.decode("utf-8")
        if "not found" in output.lower():
            raise RepositoryNotFound(
                f"The repository {repo_url} could not be found, " "have you made a typo?"
            ) from clone_error
        if any(error in output for error in BRANCH_ERRORS):
            raise RepositoryCloneFailed(
                f"The {checkout} branch of repository "
                f"{repo_url} could not found, have you made a typo?"
            ) from clone_error
        logger.error("git clone failed with error: %s", output)
        raise

    return repo_dir
