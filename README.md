# IMDB-Push

This is a little piece of software that makes it possible to push IMDB links with pushbullet to add the
related show/movie to Sonarr or Couchpotato.

## Usage

 - Start the service
 - Push IMDB link with Pushbullet to IMDB-push device
 - Wait for it to be added, if a TV show is added the first season will be monitored by default

## Setup

 - Clone the repo
 - Run `npm install`
 - Copy `.env.exmample` to `.env` and fill in all the values needed
 - Run `npm start`

## Run as a Linux systemd service

 - Copy the `imdb-push.example.service` to `imdb-push.service`
 - Update all the `/path/to/` values and replace the user with a user of your choice
 - Copy imdb-push.service to `/etc/systemd/system`
 - Run `systemctl enable imdb-push` and control the service with `systemctl [action] imdb-push|imdbpush`
