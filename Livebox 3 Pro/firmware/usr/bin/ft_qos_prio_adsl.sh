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
# Q6 of specification
-A POSTROUTING -d 10.10.10.10      -m dscp --dscp-class EF -j fusivTC --set-priority 6
# Q5 of specification
-A POSTROUTING -d 10.10.10.10      -m dscp ! --dscp-class EF -j fusivTC --set-priority 5
# Q4 of specification
-A POSTROUTING ! -d 10.10.10.10      -j fusivTC --set-priority 4

# Q7 of specification
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class EF  -j fusivTC --set-priority 7
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class CS5 -j fusivTC --set-priority 7

# Q6 of specification
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class CS6 -j fusivTC --set-priority 6
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class CS7 -j fusivTC --set-priority 6

# Q5 of specification
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class AF43 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class AF42 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class AF41 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class CS4 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class AF33 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class AF32 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class AF31 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class CS3 -j fusivTC --set-priority 5
-A POSTROUTING ! -d 10.10.10.10      -m dscp --dscp-class AF21 -j fusivTC --set-priority 5

# Q0 of specification
-A POSTROUTING -d 11.11.11.11      -j fusivTC --set-priority 1
-A POSTROUTING -d 12.12.12.12      -j fusivTC --set-priority 1

# Q5 for l2tp control packets
-A POSTROUTING -d 11.11.11.11      -m dscp --dscp-class AF13 -j fusivTC --set-priority 5
-A POSTROUTING -d 12.12.12.12      -m dscp --dscp-class AF13 -j fusivTC --set-priority 5
