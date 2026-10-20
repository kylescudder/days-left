#!/usr/bin/env python3
"""Days Left application-owned hooks for the installed deployment service."""
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
