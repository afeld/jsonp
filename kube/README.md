# Kubernetes

The examples below are using [Google Container Engine](https://cloud.google.com/container-engine/).

## Initial deployment

```bash
gcloud container clusters create jsonp-clustered --num-nodes=2 --machine-type=g1-small
kubectl create -f kube.yml --record

# re-run this until there's an EXTERNAL-IP, then visit that in your browser
kubectl get service jsonp
```

## Updates

```bash
gcloud container clusters get-credentials jsonp-clustered
kubectl replace -f kube.yml --record
```
