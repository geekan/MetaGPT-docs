# Integration with open LLM
Currently, if you want to get more stable code generation results, you need to use OpenAI's GPT-3.5 or GPT-4. But there are currently many other excellent open source models available for experiments, and relatively satisfactory results can be obtained. Therefore, in this tutorial, we will explore how to integrate with open source LLM and get project output based on your input idea. 

**Attention**  
Due to the limitations of the open source model itself, the content described in this tutorial cannot guarantee stable code generation. If you follow this tutorial to experiment, it means you already know this point.  
At the same time, we are also exploring how to obtain more stable and better-quality output under the open source model. If you are also interested in this, you can contact us in discord or WeChat community group.  
I believe that with the update of the open source model, this goal will be reached soon.   

We will conduct an overall introduction to the tutorial according to the following process:  

- Model Deployment. Use inference repo such as LLaMA-Factory, FastChat, ollama, etc. to deploy the corresponding LLM model.  
- LLM configuration.
- Optionally, repair the LLM output.
- Run.

The methods of integrating open source LLM and integrating some non-openai closed source models (such as Baidu Wenxinyiyan, iFLYTEK Spark, Zhipu ChatGLM, etc.) are similar, the main difference is the configuration. For details on the configuration of other closed-source LLMs, please refer to other LLM configuration  documents under the online document site. The other process steps after the configuration are consistent with the above.

## Model Deployment
Note that it is recommended to use the OpenAI compatible interface for model deployment. In this way, both request and response can be processed directly using openai sdk, which will simplify the overall integration process. At the same time, the following inference repos also support publishing as OpenAI-compatible interfaces (except ollama), and the workload required to change is very small.  

Note that by default you have graphics card resources for deployment, otherwise CPU inference will be a bit slow.   

### LLaMA-Factory
Repo: https://github.com/hiyouga/LLaMA-Factory

##### Installation
```
git clone https://github.com/hiyouga/LLaMA-Factory.git
conda create -n llama_factory python=3.10
conda activate llama_factory
cd LLaMA-Factory
pip install -r requirements.txt
```

For details, please see [Installation](https://github.com/hiyouga/LLaMA-Factory#dependence-installation-optional)

##### Supported Models
The common LLaMA, Llama2 and most open source models in China are supported. For details, please see [Model List](https://github.com/hiyouga/LLaMA-Factory#supported-models)

##### Deployment
Source model launching
```
python3 src/api_demo.py \
    --model_name_or_path meta-llama/Llama-2-13b-chat-hf \
    --template llama2 \
```

Loading and merging lora output launching
```
python3 src/api_demo.py \
    --model_name_or_path path_to_llama2_model \
    --template llama2 \
    --finetuning_type lora \
    --checkpoint_dir path_to_checkpoint
```

By default, the interface access address is: `http://0.0.0.0:8000/`. If you need to modify the port, enter `src/api_demo.py` to modify it.  
If you need to start with multiple cards, add `CUDA_VISIBLE_DEVICES=0,1,2` before the startup command and replace it with your card number.  
Different models support different `template` value, which can be found from `src/llmtuner/data/template.py`.  

For details, please see [API Deployment](https://github.com/hiyouga/LLaMA-Factory#api-demo)

##### Request example
```
curl -X POST http://0.0.0.0:8000/v1/chat/completions -H "content-type:application/json" -d '{
  "messages":[{"role":"user","content":"who are you"}],
  "model": "gpt-3.5-turbo",
  "stream": false,
  "max_tokens": 256
}'
```
By default, the requested `model` parameter value is `gpt-3.5-turbo`, if necessary, modify it. Enter the `list_models` method of `src/llmtuner/api/app.py` and modify it to your custom value.  

### FastChat
Repo: https://github.com/lm-sys/FastChat

##### Installation
```
pip3 install "fschat[model_worker,webui]"
```

For details, please see [Installation](https://github.com/lm-sys/FastChat#install)

##### Supported Models
The common LLaMA, Llama2 and most open source models in China are supported. For details, see [Model List](https://github.com/lm-sys/FastChat#supported-models)

##### Deployment
steps

- launch controller，`python3 -m fastchat.serve.controller`
- launch source model worker，`python3 -m fastchat.serve.model_worker --model-path lmsys/vicuna-13b-v1.5 --conv-template vicuna_v1.1 --model-names vicuna`
- launch openai compatible interface，`python3 -m fastchat.serve.openai_api_server --host localhost --port 8000`

If you need to start the lora fine-tuned model, you need to do [model merge](https://github.com/lm-sys/FastChat/blob/main/docs/vicuna_weights_version.md#how-to-apply-delta-weights-only-needed-for-weights-v0) first.

For details, please see [API Deployment](https://github.com/lm-sys/FastChat/blob/main/docs/openai_api.md)

##### Request example
```
curl -X POST http://0.0.0.0:8000/v1/chat/completions -H "content-type:application/json" -d '{
  "messages":[{"role":"user","content":"who are you"}],
  "model": "gpt-3.5-turbo",
  "stream": false,
  "max_tokens": 256
}'
```
By default, the requested `model` parameter value is `vicuna`, which corresponds to the `model-names` when starting `model_worker`.   

#### vllm
Repo: https://github.com/vllm-project/vllm

##### Installation
```
pip3 install vllm
```

For details, please see [Installation](https://docs.vllm.ai/en/latest/getting_started/installation.html)

##### Supported Models
The common LLaMA, Llama2 and most open source models in China are supported. For details, please see [Model List](https://docs.vllm.ai/en/latest/models/supported_models.html)

##### Deployment
```
python3 -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-2-13b-hf \
    --served-model-name llama2-13b
```

For details, please see [API Deployment](https://docs.vllm.ai/en/latest/getting_started/quickstart.html#openai-compatible-server)

##### Request example
```
curl -X POST http://0.0.0.0:8000/v1/chat/completions -H "content-type:application/json" -d '{
  "messages":[{"role":"user","content":"who are you"}],
  "model": "llama2-13b",
  "stream": false,
  "max_tokens": 256
}'
```
By default, the requested `model` parameter value is `llama2-13b`, which corresponds to the `served-model-name` at startup.  

### ollama
Repo: https://github.com/jmorganca/ollama

This repo is not compatible with the openai api interface. MetaGPT will support the interface provided by itself in the future.

##### Installation
```
curl https://ollama.ai/install.sh | sh
```

For details, please see [Installation](https://github.com/jmorganca/ollama/blob/main/docs/linux.md)

##### Supported Models
Mainly supports Llama2 and its derivative series, please see [Model List](https://github.com/jmorganca/ollama#model-library) for details

##### Deployment
```
ollama run llama2
```

llama2[Usage documentation](https://ollama.ai/library/llama2)

For details, please see [API deployment](https://github.com/jmorganca/ollama/blob/main/docs/api.md)

##### Request example
```
curl -X POST http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt":"Why is the sky blue?"
 }'
```

## LLM Configuration
Since the above deployment is an API interface, it takes effect by modifying the configuration file `config/key.yaml`.    

#### openai compatible interface
Such as LLaMA-Factory, FastChat, vllm openai compatible interface  

**config/key.yaml**
```config/key.yaml
OPENAI_API_BASE: "http://0.0.0.0:8000/v1"
OPENAI_API_KEY: "sk-xxx"
OPENAI_API_MODEL: "llama2-13b"
```

The complete routing of the openapi interface `http://0.0.0.0:8000/v1/chat/completions`, `OPENAI_API_BASE` only needs to be configured to `http://0.0.0.0:8000/v1`, and the remaining parts will be filled by openai sdk itself. `OPENAI_API_KEY` needs to be set to any value starting with `sk-`. `OPENAI_API_MODEL` is the actual value of the request interface parameter `model`.

#### ollama api interface

**pending upgrade**

## Optional, repair LLM output

### Background
This tutorial mainly guides how to integrate open source models (and non-openai closed source models) in MetaGPT. Since the output results of LLM have a great relationship with the prompt instruction format, open source models (also some non-openai closed source models) are often very complicated. It is difficult to follow MetaGPT's existing roles' instructions for output. On the one hand, we will optimize the role instructions so that they have better command result output compatibility under most open and closed source models. On the other hand, based on the current situation, we will repair the output content of the open source LLM to improve the overall execution success rate.   

### Main issues with open source model command output
Including some issues with non-openai closed source models.    
MetaGPT's prompt has strong structural requirements for output. It is often difficult to follow the complete output according to the instructions when an open source model works, resulting in missing, omitted, and errors in the output content. The main manifestations are as follows:  

- The target key cannot output according to the upper and lower case agreed by prompt.  
- The output json plain text contains missing or extra special characters. For example, `{"a":b"}}`, `{"a":b"]}`, `{"a":b"` and so on.  

In response to the above situation, we have added the feature of repairing open source LLM output, specifically    
**config/key.yaml**  
```
REPAIR_LLM_OUTPUT: true
```

After turning on this function, an attempt will be made to repair the above situation during execution. This switch currently does not guarantee a complete repair. There will still be some situations that we have not covered yet (different open source models have different situations), and the execution process will be interrupted and exited. If you are interested with this, please submit a PR and attach the corresponding model description, test log and unittest cases.   

If you enable this function, it means that the LLM output (ProductManager and Architect roles in the software company in MetaGPT) will be repaired. The keyword `repair_` will appear in the log. You can pay attention to it.  

## Run
After following the above process, you can start using it officially.    
`python3 startup.py "write a snake game"`

### Extension
MetaGPT itself is a multi-agent framework and is not limited to software project generation. You can also combine the integrated open source model to build the corresponding agent for use in your own application scenarios.  
Start your journey of intelligent agents~  
