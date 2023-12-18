# 配置多LLM流程
  目前metagpt中完成一次任务，需要调用多次LLM相关服务，这使得在成本上显得并不划算。现在已经有许多开源大模型宣称能够达到与ChatGPT同等水平，且有诸多开源框架提供推理、部署服务  
使得接入开源LLM并根据输入需求得到项目输出变得简单
  但是开源LLM在能力上有所差异，利用具有特定能力的模型完成指定任务会能大大提示项目成功输出的几率 。因此，在本教程中我们将探讨如何使用多LLM指定特定Role/Action完成项目输出  

  
## 1. 启动OPENAI API服务
   
   可参考以下教程   
   https://github.com/geekan/MetaGPT-docs/blob/main/src/zh/guide/tutorials/integration_with_open_llm.md  

## 2. 配置MG多LLM相关选项
### 1. 开启多LLM服务  
通过修改配置文件`config/multi_llm_config.yaml`生效。以下提供一个配置示例，其中`ProductManager`将使用openai作为LLM基座，`WritePRD`将使用开源的`Llama-2-13b-chat-hf`作为LLM基座。
以下是配置文件中的内容，其中你可以模仿我们的示例，添加/修改你想指定的LLM，或为不同的`Action\Role`配置LLM
  
  ```yaml
  ####Provide LLM
  ####Currently support openai,claude,spark,zhipu,class openai
  ###Customize the LLM used by the role
  ProductManager: openai
  
  ####Customizing the LLM used by Action
  WritePRD: Llama-2-13b-chat-hf
   
  ####Customize LLM name and request address
  MODEL_LIST:
    Llama-2-13b-chat-hf:
      open_llm_api_base: "http://0.0.0.0:12346/v1"
  ```

### 2. 修改指定Role/Action使用的LLM
#### 1. Role/Action指定使用openai服务  
  多LLM可以配置openai作为其LLM基座，类似的你可以模仿我们的示例，对`ProductManager` 和 `WritePRD` 使用openai作为LLM服务，你需要在`config.yaml` 中配置好相关信息

  **需要注意：目前暂时不提供多个`base_key`、`base_api`、`base_model`的相互切换功能。**  
      
   ```yaml
   ####Provide LLM
   ####Currently support openai,claude,spark,zhipu,class openai
   ###Customize the LLM used by the role
   ProductManager: openai

   ####Customizing the LLM used by Action
   WritePRD: openai
   ```

  **在 config\config.yaml 中确保以下信息配置正确**

   ```yaml
    #OPENAI_API_BASE: "https://api.openai.com/v1"
    #OPENAI_API_BASE: "https://openkey.cloud/v1"
    #OPENAI_API_BASE: "https://api.openai-forward.com/v1"
    #OPENAI_PROXY: "http://127.0.0.1:8118"
   ```   

#### 2. Role/Action指定使用claude服务
  我们项目同样支持使用claude作为LLM基座，类似openai配置方法，你可以模仿我们的示例，为`Architect` 和 `WriteDesing`配置claude，同样你需要在config.yaml 中配置好相关信息

  ```yaml
  ####Provide LLM
  ####Currently support openai,claude,spark,zhipu,class openai
  ###Customize the LLM used by the role
  ProductManager: openai
  Architect: claude
    
  ####Customizing the LLM used by Action
  WritePRD: openai
  WriteDesign: claude
  ```
    
  **在 config\config.yaml 中确保以下信息配置正确**
  
  ```yaml
  #Anthropic_API_KEY: "YOUR_API_KEY"
  ```
#### 3. Role/Action指定使用spark服务
   我们项目同样支持使用spark作为LLM基座，类似openai配置方法，你可以模仿我们的示例，为`ProjectManager` 和`WriteTasks`配置spark，同样你需要在config.yaml 中配置好相关信息  
  
  ```yaml
  ####Provide LLM
  ####Currently support openai,claude,spark,zhipu,class openai
  ###Customize the LLM used by the role
  ProductManager: openai
  Architect: claude
  ProjectManager: spark
  ####Customizing the LLM used by Action
  WritePRD: openai
  WriteDesign: claude
  WriteTasks: spark
  ```
      
  **在 config\config.yaml 中确保以下信息配置正确**
      
  ```yaml
  #SPARK_APPID : "YOUR_APPID"
  #SPARK_API_SECRET : "YOUR_APISecret"
  #SPARK_API_KEY : "YOUR_APIKey"
  #DOMAIN : "generalv2"
  #SPARK_URL : "ws://spark-api.xf-yun.com/v2.1/chat"
  ```          

#### 4. Role/Action指定使用zhipu服务  
    我们项目同样支持使用zhipu作为LLM基座，类似openai配置方法，你可以模仿我们的示例，为ProjectManager 和 WriteTasks配置zhipu，同样你需要在config.yaml 中配置好相关信息
    
  ```yaml
  ####Provide LLM
  ####Currently support openai,claude,spark,zhipu,class openai
  ###Customize the LLM used by the role
  ProductManager: openai
  Architect: claude
  ProjectManager: spark
  Engineer: zhipu

  ####Customizing the LLM used by Action
  WritePRD: openai
  WriteDesign: claude
  WriteTasks: spark
  WriteCode: zhipu
  ```
    
  **在`config/config.yaml` 中确保以下信息配置正确**
  
  ```yaml
  # ZHIPUAI_API_KEY: "YOUR_API_KEY"
  ```

  #### 5. Role/Action指定使用仿openai接口服务   
  我们的项目支持仿openai接口服务，类似openai的配置方法，支持多个不同开源LLM相互切换，你可以模型我们的样例，为不同的Action\Role配置LLM
  我们的样例中，为``WritePRD`配置了deepseek-llm-67b-chat` 作为LLM基座，接着`open_llm_api_base: "http://0.0.0.0:12345/v1"` 配置该服务的接口地址，只有正确配置了该地址才能够使用该服务
    
  ```yaml
  ####Provide LLM
  ####Currently support openai,claude,spark,zhipu,class openai
  ###Customize the LLM used by the role
  ProductManager: openai
  Architect: claude
  ProjectManager: spark
  Engineer: zhipu
     
  ####Customizing the LLM used by Action
  WritePRD: deepseek-llm-67b-chat
  WriteDesign: Llama-2-13b-chat-hf
  WriteTasks: baichuan2-13b
  WriteCode: chatglm3-6b
     
     
  MODEL_LIST:
  deepseek-llm-67b-chat:
   open_llm_api_base: "http://0.0.0.0:12345/v1"
  Llama-2-13b-chat-hf:
   open_llm_api_base: "http://0.0.0.0:12346/v1"
  baichuan2-13b:
   open_llm_api_base: "http://0.0.0.0:12347/v1"
  chatglm3-6b:
   open_llm_api_base: "http://0.0.0.0:12348/v1"
   ```

  **注意：在这里我们没有配置WriteCodeReview 使用的LLM服务，则会从config/config.yaml中推断出能够使用的LLM作为基座，默认使用openai，若配置不完整则会报错**
### 4. 关闭多LLM服务  

 关闭多LLM服务，你只需要将`config/multi_llm_config.yaml`中的所有内容删除即可。即只使用单个LLM作为基座，将会按照`config/config.yaml `中的配置顺序选择LLM服务

 
 
   
