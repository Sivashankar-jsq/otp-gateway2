# Generate a Github Personal Access Token with (from https://github.com/settings/tokens)
#  - write:packages
#
# You must have the following environment variables defined to pull the Universal Chart:
#  - TILT_GITHUB_USERNAME
#  - TILT_GITHUB_TOKEN  (frmo above step)
#
# You must also have the following installed:
#  - tilt (brew install tilt-dev/tap/tilt)
#  - helm (brew install kubernetes-helm)
#  - kubectl_build (brew tap vmware-tanzu/buildkit-cli-for-kubectl https://github.com/vmware-tanzu/buildkit-cli-for-kubectl && brew install kubectl-buildkit)

# You must also set up a remote builder
# docker buildx create  --bootstrap  --name=$(TILT_GITHUB_USERNAME) --driver=kubernetes  --driver-opt=namespace=buildkit,replicas=1

service_name = 'jsq-svc-sample'
#
# Extensions and Settings
#
load('ext://kubectl_build', 'kubectl_build')
load('ext://helm_resource', 'helm_resource', 'helm_repo')
load('ext://helm_remote', 'helm_remote')
load('ext://namespace', 'namespace_create', 'namespace_inject')
load('ext://uibutton', 'cmd_button', 'text_input', 'location')

update_settings(max_parallel_updates=3,
                k8s_upsert_timeout_secs=300,
                suppress_unused_image_warnings="false")

#
# This should always be set to the dev cluster. Do not change this unless you
# are deploying to a local Kubernetes cluster.
#
allow_k8s_contexts(['arn:aws:eks:us-west-2:847118582397:cluster/test', 'test'])


username = os.environ['TILT_GITHUB_USERNAME'].lower()

#
# Download the universal chart
#
helmChartVersion = 'v1.0.335'
local('helm registry login ghcr.io --username ' + username + ' --password $TILT_GITHUB_TOKEN')

#
# Build Docker image on the remote cluster
#
# kubectl_build(
#   'ghcr.io/junipersquare/' + os.environ['TILT_GITHUB_USERNAME'] + '-main',
#   '.',
#   dockerfile='./infra/Dockerfile',
#   cache_from=['ghcr.io/junipersquare/' + os.environ['TILT_GITHUB_USERNAME'] + '-main'],
#   extra_tag='ghcr.io/junipersquare/' + os.environ['TILT_GITHUB_USERNAME'] + '-main:latest',
#   push=True,
#   live_update=[
#     sync('.', '/app'),
#     run('cd /app && pip install -r requirements.txt',
#         trigger='./requirements.txt'),
# ])

custom_build(
  'ghcr.io/junipersquare/'+ username + '-' + service_name,
  'docker buildx build . --platform=linux/amd64 --builder=' + username + ' --cache-to=type=registry,ref=ghcr.io/junipersquare/'
  + username + '-' + service_name + ':buildcache,mode=max --cache-from=type=registry,ref=ghcr.io/junipersquare/' + username
  + '-' + service_name + ':buildcache -f Dockerfile -t $EXPECTED_REF --push',
  ['./'],
  skips_local_docker=True,
  disable_push=True,
)

#
# Build Docker image using local Docker
#
# docker_build(
#   'ghcr.io/junipersquare/'+ username + '-main',
#   '.',
#   dockerfile='./infra/Dockerfile',
#   extra_tag='ghcr.io/junipersquare/' + username + '-main:latest',
#   live_update=[
#     sync('.', '/app'),
#     run('cd /app && pip install -r requirements.txt',
#     trigger='./requirements.txt')
# ])
# docker_prune_settings (disable = False, max_age_mins = 360 , num_builds = 0 , interval_hrs = 1 , keep_recent = 2 )

#
# Create namespace and Github Contrainer Registry secret
#

local('kubectl create namespace ' + username + ' --dry-run=client -o yaml | kubectl apply -f -')
local('kubectl create secret docker-registry docker-registry --docker-server=ghcr.io --docker-username=' + username + ' --docker-password=$TILT_GITHUB_TOKEN --namespace ' + username + ' --dry-run=client -o yaml | kubectl apply -f -')

#
# sample svc
#

k8s_yaml(helm(
  'infra/universal-chart',
  name=service_name,
  namespace=username,
  values=['./infra/values-dev.yaml'],
  set=['global.namespace=' + username, 'global.image.repository=ghcr.io/junipersquare/' + username + '-' + service_name]
))
