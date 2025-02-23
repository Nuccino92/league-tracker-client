Table seasons {
id int [pk, increment]
name varchar
status varhcar // active, new, closed
league_id int [ref: > leagues.id]
created_at timestamp
updated_at timestamp
}

Table tournaments {
id integer [primary key]
season_id integer
name varchar
format varchar // single elimination, double elimination, round robin
start_date date
end_date date
status varchar
max_teams integer // enforce tournament size
current_round integer // track progress
created_at timestamp
updated_at timestamp
}

Table tournament_matches {
id integer [primary key]
tournament_id integer
round_number integer
match_number integer
next_match_id integer // for tournament progression
team_1_id integer
team_2_id integer
winner_id integer
game_date datetime
location varchar
home_score integer
away_score integer
status varchar
created_at timestamp
updated_at timestamp
}

Table tournament_teams {
id integer [primary key]
tournament_id integer [ref: > tournaments.id]
team_id integer [ref: > teams.id]
seed integer
status varchar(20) // active, eliminated, champion
created_at timestamp
updated_at timestamp
}

Table tournament_rounds {
id integer [primary key]
tournament_id integer [ref: > tournaments.id]
round_number integer
start_date date
end_date date
status varchar(20) // pending, active, completed
created_at timestamp
updated_at timestamp
}

Table players {
id integer [primary key]
name varchar
email varchar
created_at timestamp
updated_at timestamp
}

Table player_tournament_stats {
id integer [primary key]
player_id integer
tournament_id integer
games_played integer
stats jsonb  
created_at timestamp
updated_at timestamp
}

------- tournament refactors -------

league site:

1. create tournaments tab beside stangs on league website
2. inside tournaments tab, have list of tournaments displaying their names with a link to the tournament page
3. inside tournaments page, have tabs to select tournament viewer (the graphs connecting), games, player stats, maybe an about. (THIS COULD REPLACE THE REGULAR SEASON BLUE NAV LINKS, PUT A WAY TO GO BACK TO REGULAR SEASON, TOURNAMENT COLORS COULD BE GOLD OR SOMETHING ELSE)

---

https://www.getapp.ca/directory/747/sports-league/software
https://www.ezfacility.com/features/league-scheduling-management/

create mass generators where you just type in a name and it adds the player/team for you

Registration should auto create a player. Also if don't want to auto create but link to an already created player that should be an option

-add teams ui inside the calendar selection
-Create a page on the site where users can search for their league to view their league web page with all their stats etc

-replace home with dashboard
-have website visits, notification anayltics. registration anayltics. current season standings etc.

-add settings tab. Put home form inside, add league stats (ppg, ast, etc.). Look to add others.

@@@important, make it easy to submit game results

Key Features:
Calendar/Reminder System
Facility Scheduling
In-Game Analytics
Electronic Payments
Communication Management
Member Directory
Volunteer Management
Attendance Tracking
Payment Processing
Event Management
Team Management

Idenify Icons https://lottiefiles.com/

CREATE A THEME PROVIDER!!

Make app responsive

TeamForm -Add expand/close animation to hide/show options button

Refactor all page client components into server components

set fixed width on sidebar

refactor the response types into zod schema's that then act as types

make fetch requests no-cache

create a fetch

fix SIDEBAR RE OPENING ON PAGE CHANGE

create another seasons tab

CONTROL-PANEL
POSSIBLY RESET CONTROL PANEL CACHE EVERY X NUMBER OF MINUTES

    Players:
        create/edit player form
        figure out dropdowns
        delete modal
        flush out how i want actions to effect things

!! @@ Set up league signup/register process for the players to automatically track/accept payments and create a player like in the control panel
