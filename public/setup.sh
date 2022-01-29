sudo apt update
sudo apt install docker.io -y

echo 'sudo docker run -d --name nginx-proxy -p 80:80 -p 443:443 -v certs:/etc/nginx/certs -v vhost:/etc/nginx/vhost.d -v html:/usr/share/nginx/html -v /var/run/docker.sock:/tmp/docker.sock:ro --restart unless-stopped nginxproxy/nginx-proxy' > startacme.sh

echo 'sudo docker run -d --name nginx-proxy-acme --volumes-from nginx-proxy --volume /var/run/docker.sock:/var/run/docker.sock:ro --volume acme:/etc/acme.sh --env "DEFAULT_EMAIL=$1" --restart unless-stopped nginxproxy/acme-companion' >> startacme.sh

echo 'docker run --detach  --name $1  --env "VIRTUAL_HOST=$2" -e "VIRTUAL_PORT=80" -e "LETSENCRYPT_HOST=$2" -v /home/ubuntu:/usr/share/nginx/html:ro --restart unless-stopped nginx ' > startnginx.sh

echo 'sudo docker run -d --name $1 -e "VIRTUAL_HOST=$2" -e "VIRTUAL_PORT=8443" -e "LETSENCRYPT_HOST=$2" -e PUID=1000 -e PGID=1000 -e PASSWORD=$2 -e SUDO_PASSWORD=123123123 -v /home/ubuntu:/config/workspace --restart unless-stopped ghcr.io/linuxserver/code-server' > startcode.sh