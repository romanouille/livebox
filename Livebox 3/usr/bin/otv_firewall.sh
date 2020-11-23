#/bin/sh/


case $1 in
     main_rules)
        /usr/sbin/iptables -$2 FORWARD_Services -t filter -i bridge -o $3 -j FORWARD_OTV_Services
        ;;
     aux_rules)
        /usr/sbin/iptables -t filter -$2 FORWARD_OTV_Services -s $3 -p 17 --dport 4995 -j ACCEPT
        /usr/sbin/iptables -t filter -$2 FORWARD_OTV_Services -s $3 -p 6 --dport 7443 -j ACCEPT
        /usr/sbin/iptables -t filter -$2 FORWARD_OTV_Services -s $3 -p 6 --dport 9200 -j ACCEPT
        /usr/sbin/iptables -t filter -$2 FORWARD_OTV_Services -s $3 -p 6 --dport 9443 -j ACCEPT
        ;;
     *)
        echo "Usage: $0 [main_rules or aux_rules]"
        ;;
esac
