set -e

#This will let you forward local ports to services running in kubernetes cluster
#Ideally you want to port forward to dependency/downstream services so you can test this service locally while connecting to remote services
#Change namespace and service name as needed - add or remove services as needed
DEP_SVC_NAME_1=service/jsq-svc-service1
DEP_SVC_NAME_2=service/jsq-svc-service2

echo "Port forwarding to dependency service 1"
kubectl port-forward -n <namespace> $DEP_SVC_NAME_1 8082:8080 &
echo "Port forwarding to dependency service 2"
kubectl port-forward -n <namespace> $DEP_SVC_NAME_2 8083:8080 &

echo "Following logs..."
kubectl logs -f $DEP_SVC_NAME_1 &
kubectl logs -f $DEP_SVC_NAME_2 &

wait