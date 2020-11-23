# must be received from caller
#SEGW=10.10.10.10     
#L2TP_SERVER=11.11.11.11     
#===============================================================================================
# 								Configure PRIORITY	
#===============================================================================================
# ******* la commande iptables est ajoute en debut de chaque ligne par l'API firewall **********
# ******* must be received from caller
# l'@ IP 10.10.10.10      correspond a la security GW (SEGW: non utilise pour l'instant) 
# l'@ IP 11.11.11.11 correspond a l'@ du premier serveur L2TP (L2TP_SERVER: non utilise pour l'instant)
# l'@ IP 12.12.12.12 correspond à l'@ du deuxième serveur L2TP
#===============================================================================================
# Q1 of specification
-A POSTROUTING ! -d 11.11.11.11      -j fusivTC --set-priority 4
-A POSTROUTING ! -d 12.12.12.12      -j fusivTC --set-priority 4

# Q2 of specification
-A POSTROUTING -d 11.11.11.11      -j fusivTC --set-priority 1
-A POSTROUTING -d 12.12.12.12      -j fusivTC --set-priority 1
