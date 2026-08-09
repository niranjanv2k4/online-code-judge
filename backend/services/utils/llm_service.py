from langchain.chat_models import init_chat_model
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate


class llm_schema(BaseModel):
    code : str = Field(description="If a code is generated put the code here, otherwise empty string")
    response: str = Field(description="Response to user prompt")

llm_ollama = init_chat_model(model="llama3.2:3b", model_provider="ollama")


llm_structured_ollama = llm_ollama.with_structured_output(llm_schema)
prompt_template = ChatPromptTemplate.from_messages([
    ("user", """
You are a coding assistant.

User request:
{prompt}

Programming language:
{language}

If the user is asking for code:
- Put the COMPLETE generated source code in the `code` field.
- Put a short explanation in the `response` field.
- The `code` field must contain ONLY the source code.
- Do NOT put the programming language name in the `code` field.
- If the user is not asking for code, set `code` to an empty string.

Preserve normal source-code formatting, including newlines and indentation.
""")
])

def process_prompt(prompt: str, language: str) -> dict:

    final_prompt = prompt_template.invoke({
        "prompt": prompt,
        "language" : language
        })

    result = llm_structured_ollama.invoke(final_prompt)

    return result.model_dump()

