# This script is licensed under the GNU General Public License v2.0 (https://github.com/Romitou/skript/blob/master/LICENSE).
# Please read README.md before use (https://github.com/Romitou/skript/blob/master/README.md).

on npc damage by entity:
	cancel event
	add 1 to {mayhem.d::%player%}

command /mm [<text>] [<offline player>]:
	permission: mod.use
	permission message: &cVous n'avez pas la permission d'utiliser cette commande
	trigger:
		if arg 1 is set:
			if arg 2 is not set:
				send ""
				send "&6[Mayhem]&f Utilisation: &6/&emm <type de triche> <joueur>"
				send "&7Types de triche: &fFF &7(ForceField), &fKB &7(KnockBack), &fALL &7(KB + FF)"
				send ""
				stop
			else if arg 2 is not online:
				send ""
				send "&6[Mayhem] &e%arg-2%&7:&f Ce joueur n'est pas connecté."
				send ""
				stop
			if arg 1 is "ff":
				set {_cheat} to "FF"
			else if arg 1 is "kb":
				set {_cheat} to "KB"
			else if arg 1 is "all":
				send ""
				send "&6[Mayhem]&d[ALL] &e%arg-2%&7: &fRequête de vérification..."
				send ""
				wait 1 second		
				make player execute command "/mm ff %arg-2%"
				make player execute command "/mm kb %arg-2%"
				stop
			else if arg 1 is "list":
				send ""
				send "&6[Mayhem] &e%arg-2%&7: &fRécupération de la liste des violations..."
				if {mayhem::list::%arg-2%} is not set:
					send "&7Aucun rapport enregistré"
					stop
				send "%{mayhem::list::%arg-2%}%"
				stop
			else:
				send ""
				send "&6[Mayhem]&f Utilisation: &6/&emm <type de triche> <joueur>"
				send "&7Types de triche: &fFF &7(ForceField), &fKB &7(KnockBack), &fALL &7(KB + FF)"
				send ""
				stop
			if {mayhem::%arg 2%} is set:
				send ""
				send "&6[Mayhem]&d[%{_cheat}%] &e%arg-2%&7:&f Mise en file d'attente..."
				send ""
				while {mayhem::%arg 2%} is set:
					wait 3 seconds
					if {mayhem::%arg 2%} is not set:
						check("%{_cheat}%", arg-2, player)
						exit loop
			else:
				send ""
				send "&6[Mayhem]&d[%{_cheat}%] &e%arg-2%&7:&f Requête de vérification..."
				check("%{_cheat}%", arg-2, player)
				send ""
		else:
			send ""
			send "&6[Mayhem]&f Utilisation: &6/&emm <type de triche> <joueur>"
			send "&7Types de triche: &fFF &7(ForceField), &fKB &7(KnockBack), &fALL &7(KB + FF)"
			send ""

function check(cheat: text, c: player, p: player):
	send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7:&f Vérification en cours..." to {_p}
	if {_cheat} = "KB":
		set {mayhem::%{_c}%} to true
		set walk speed of {_c} to 0
		set fly speed of {_c} to 0
		loop 5 times:
			add 1 to {_count}
			set {_loc1.%{_c}%} to {_c}'s location
			teleport {_c} to {_loc1.%{_c}%}
			set {_gm} to gamemode of {_c}
			set gamemode of {_c} to spectator			
			wait 15 ticks
			push {_c} upwards at speed 1.5
			push {_c} east at speed 2.1
			push {_c} north at speed 2.1
			wait 4.5 ticks
			set {_loc2.%{_c}%} to {_c}'s location
			wait 1 tick
			set gamemode of {_c} to {_gm}
			teleport {_c} to {_loc1.%{_c}%}
			set {_y} to difference between y-coordinate of {_loc1.%{_c}%} and y-coordinate of {_loc2.%{_c}%}
			set {_x} to difference between x-coordinate of {_loc1.%{_c}%} and x-coordinate of {_loc2.%{_c}%}
			set {_z} to difference between z-coordinate of {_loc1.%{_c}%} and z-coordinate of {_loc2.%{_c}%}
			set {_total.%{_count}%} to {_y} + {_x} + {_z}
		set {_tota1} to {_total.1} + {_total.2} + {_total.3} + {_total.4} + {_total.5}
		set {_total} to {_tota1} / 5
		if {_total} is between 0 and 16:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &dDETECTED &7(VL: &f%{_total}%&7)" to {_p}
		if {_total} is between 16.1 and 18.3:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &6MAYBE &7(VL: &f%{_total}%&7)" to {_p}
		else if {_total} is between 18.4 and 22:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &aNOTHING &7(VL: &f%{_total}%&7)" to {_p}
		else if {_total} >= 22.1:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &9NOT EXPECTED &7(VL: &f%{_total}%&7)" to {_p}
		clear {mayhem::%{_c}%}
		set gamemode of {_c} to {_gm}
		reset walk speed of {_c}
		reset fly speed of {_c}
	else if {_cheat} = "FF":
		set {mayhem::%{_c}%} to true
		clear {mayhem.d::%{_c}%}
		set {_npc} to a npc with name "%random player out of all players%" and entity type "PLAYER"
		spawn npc {_npc} at location of {_c}
		set the protected state of npc {_npc} to false
		set {_entity} to entity from npc {_npc}
		apply invisibility to {_entity} for 999 seconds
		set {_time} to 0
		while {_time} <= 20:
			add 1 to {_time}
			set {_loc} to location 2 behind {_c}
			add 1.5 to y-coordinate of {_loc}
			if {_loc} is not location of npc {_npc}:
				teleport npc {_npc} to {_loc}
			make npc {_npc} look at {_c}
			wait 10 tick
		set {_total} to {mayhem.d::%{_c}%}
		clear all effects from {_entity}
		unregister npc {_npc}
		clear {mayhem.d::%{_c}%}
		clear {mayhem::%{_c}%}
		if {_total} is not set:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &aNOTHING &7(VL: &f0&7)" to {_p}
		if {_total} is between 0 and 2:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &aNOTHING &7(VL: &f%{_total}%&7)" to {_p}
		if {_total} is between 3 and 5:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &6MAYBE &7(VL: &f%{_total}%&7)" to {_p}
		if {_total} >= 6:
			send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &dDETECTED &7(VL: &f%{_total}%&7)" to {_p}

function autocheck(c: player):
	send "&7[Mayhem] &e%{_c}%&7:&f Vérification automatique en cours..." to {mod::autocheck::*}
	set {_cheat} to "KB"
	set {mayhem::%{_c}%} to true
	set walk speed of {_c} to 0
	set fly speed of {_c} to 0
	loop 5 times:
		add 1 to {_count}
		set {_loc1.%{_c}%} to {_c}'s location
		teleport {_c} to {_loc1.%{_c}%}
		set {_gm} to gamemode of {_c}
		set gamemode of {_c} to spectator			
		wait 15 ticks
		push {_c} upwards at speed 1.5
		push {_c} east at speed 2.1
		push {_c} north at speed 2.1
		wait 4.5 ticks
		set {_loc2.%{_c}%} to {_c}'s location
		wait 1 tick
		set gamemode of {_c} to {_gm}
		teleport {_c} to {_loc1.%{_c}%}
		set {_y} to difference between y-coordinate of {_loc1.%{_c}%} and y-coordinate of {_loc2.%{_c}%}
		set {_x} to difference between x-coordinate of {_loc1.%{_c}%} and x-coordinate of {_loc2.%{_c}%}
		set {_z} to difference between z-coordinate of {_loc1.%{_c}%} and z-coordinate of {_loc2.%{_c}%}
		set {_total.%{_count}%} to {_y} + {_x} + {_z}
	set {_tota1} to {_total.1} + {_total.2} + {_total.3} + {_total.4} + {_total.5}
	set {_total} to {_tota1} / 5
	if {_total} is between 0 and 16:
		send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &dDETECTED &7(VL: &f%{_total}%&7)" to {mod::autocheck::*}
		add "&e%now%&7: &dAntiKnockback &7(VL: &f%{_total}%&7)" to {mayhem::list::%{_c}%}
	if {_total} is between 16.1 and 18.3:
		send "&6[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &6MAYBE &7(VL: &f%{_total}%&7)" to {mod::autocheck::*}
		add "&e%now%&7: &6AntiKnockback &7(VL: &f%{_total}%&7)" to {mayhem::list::%{_c}%}
	else if {_total} is between 18.4 and 22:
		send "&7[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &aNOTHING &7(VL: &f%{_total}%&7)" to {mod::autocheck::*}
		add 1 to {_clear}
	else if {_total} >= 22.1:
		send "&7[Mayhem]&d[%{_cheat}%] &e%{_c}%&7: &9NOT EXPECTED &7(VL: &f%{_total}%&7)" to {mod::autocheck::*}
	clear {mayhem::%{_c}%}
	set gamemode of {_c} to {_gm}
	reset walk speed of {_c}
	reset fly speed of {_c}
	wait 10 ticks
	set {_cheat} to "FF"
	set {mayhem::%{_c}%} to true
	clear {mayhem.d::%{_c}%}
	set {_npc} to a npc with name "%random player out of all players%" and entity type "PLAYER"
	spawn npc {_npc} at location of {_c}
	set the protected state of npc {_npc} to false
	set {_entity} to entity from npc {_npc}