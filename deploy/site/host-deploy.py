#!/usr/bin/env python3
"""Days Left settings and hooks for the shared host deployer (deploy_core.py)."""
from pathlib import Path
import re

import deploy_core as core


def accept(image):
    html = core.compose('exec', '-T', 'days-left', 'wget', '-qO-', 'http://127.0.0.1:8080/', image=image).decode()
    if 'Nearly there,' not in html or 'countdown-card' not in html:
        raise core.Error('Site content verification failed.')
    assets = set(re.findall(r'(?:src|href)="(/(?:_astro/|favicon)[^"]+)"', html))
    if not assets or not any(asset.endswith('.webp') for asset in assets):
        raise core.Error('Expected built site assets were missing.')
    for asset in sorted(assets):
        core.compose('exec', '-T', 'days-left', 'wget', '-qO', '/dev/null',
                     'http://127.0.0.1:8080' + asset, image=image)


APP = core.App(
    name='days-left', title='Days-Left',
    image='ghcr.io/kylescudder/days-left', repo='kylescudder/days-left',
    image_var='DAYS_LEFT_IMAGE', service='days-left', app_dir=Path(__file__).resolve().parents[2],
    workflow='deploy-site.yml',
    compose_file='compose.site.yaml',
    accept=accept,
    public_status=True)

if __name__ == '__main__':
    core.cli(APP, __file__)
