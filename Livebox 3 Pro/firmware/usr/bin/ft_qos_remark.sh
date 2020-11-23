#===============================================================================================
# 									Remarquage WAN -> LAN
#===============================================================================================
# ******* la commande iptables est ajoute en debut de chaque ligne par l'API firewall **********
#===============================================================================================
#-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS0 -j fusivTC --set-dscp-class CS0
#-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS4 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS6 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS5 -j fusivTC --set-dscp-class CS6
-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS7 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class EF -j fusivTC --set-dscp-class CS6
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF43 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF42 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF41 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF33 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF32 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF31 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS3 -j fusivTC --set-dscp-class CS4
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF23 -j fusivTC --set-dscp-class CS0
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF22 -j fusivTC --set-dscp-class CS0
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF21 -j fusivTC --set-dscp-class CS5
-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS2 -j fusivTC --set-dscp-class CS0
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF13 -j fusivTC --set-dscp-class CS0
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF12 -j fusivTC --set-dscp-class CS0
-A POSTROUTING -o BR_LAN -m dscp --dscp-class AF11 -j fusivTC --set-dscp-class CS0
-A POSTROUTING -o BR_LAN -m dscp --dscp-class CS1 -j fusivTC --set-dscp-class CS0

