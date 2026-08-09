from langchain.chat_models import init_chat_model

llm_ollama = init_chat_model(model="llama3.2:3b", model_provider="ollama")

def process_prompt(prompt: str) -> str:
    result = llm_ollama.invoke(prompt).content
    return result

