# Kubernetes

The examples below are using [Google Container Engine](https://cloud.google.com/container-engine/).

## Initial deployment

```bash
gcloud container clusters create jsonp-clustered --num-nodes=2 --machine-type=g1-small
kubectl create secret generic newrelic --from-literal=license-key=<KEY>
kubectl create -f kube.yml --record

# wait a minute or so for this to show an EXTERNAL-IP, then visit that in your browser
kubectl get service jsonp -w
```

## Updates

```bash
gcloud container clusters get-credentials jsonp-clustered
kubectl apply -f kube.yml --record
```
