set -e

#This script will let you access this service instance running in kubernetes cluster
NAMESPACE=soa-nodejs-template-service
LOCAL_SVC_NAME=service/sample-svc-hello-world

echo "Port forwarding to this service on kubernetes cluster"
kubectl port-forward -n $NAMESPACE $LOCAL_SVC_NAME 8080:8080 &

echo "Following logs..."
kubectl logs -f $LOCAL_SVC_NAME &

wait