# ZSH History Backup – Operational Reference

## System Overview

Script:
    ~/bin/backup_zsh_history.sh

Backups:
    ~/history_backups/

LaunchAgent:
    ~/Library/LaunchAgents/com.maxtwoseven.backupzshhistory.plist

---

## Commands

Check status:
    launchctl list | grep backupzshhistory

Enable:
    launchctl load -w ~/Library/LaunchAgents/com.maxtwoseven.backupzshhistory.plist

Disable:
    launchctl unload -w ~/Library/LaunchAgents/com.maxtwoseven.backupzshhistory.plist

Manual backup:
    ~/bin/backup_zsh_history.sh

List backups:
    ls -lt ~/history_backups

View latest:
    less ~/history_backups/$(ls -t ~/history_backups | head -n1)

---

## Mental Model

LaunchAgent → runs script → snapshots history → rotates backups.
