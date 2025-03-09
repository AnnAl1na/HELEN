import argparse
import os
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
from langchain_groq import ChatGroq

from langchain_community.embeddings.fastembed import FastEmbedEmbeddings

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
You are an experienced teacher helping a student understand concepts from their textbook.  
Use the following context to provide a clear and detailed explanation, ensuring the student fully grasps the topic.  

Explain in a step-by-step manner, using simple language if needed, and provide examples where relevant.  

If the context does not contain the answer, politely let the student know in a very few words .  



### Context:  
{context}  

### Student's Question:  
{question} 

"""

PROMPT_TEMPLATE_1 = """
Generate one question based on the following textbook content and provide its answer.  
Format the response as:  
<Question>  
###  
<Answer>  

Textbook Content:  
{context}


"""

PROMPT_TEMPLATE_2 = """
You are an expert tutor analyzing a student's response. Below are two contexts:  

**Context 1:** (Student's Response)  
{context}  

**Context 2:** (Correct Answer / Model Analysis)  
{context2}  

Assess how accurate the student's response is compared to the correct answer. Briefly say:  
- To what extent the student's response is correct.  
- Any misconceptions or missing details.  
- Additional insights to help the student understand better.  

Your response should be clear, constructive, and encouraging, like a teacher guiding a student.  


"""

def main():
    # Create CLI.
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text
    #query_rag(query_text)


def query_rag(query_text: str, source_filename: str):
    # Prepare the DB.
    #embedding_function = get_embedding_function()
    path = f"{source_filename}.pdf"
    pdf_chroma_path = os.path.join(CHROMA_PATH, path)
    db = Chroma(persist_directory=pdf_chroma_path, embedding_function=FastEmbedEmbeddings())

    # Search the DB.
    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    #print(prompt)

    #model = Ollama(model="mistral")
    #response_text = model.invoke(prompt)
    llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.5,
            api_key = "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"
        )
    response_text = llm.invoke(prompt).content
    #print(response_text)

    sources = [doc.metadata.get("id", None) for doc, _score in results]
    formatted_response = f"Response: {response_text} \n Sources: {sources}"
    print(formatted_response)
    return response_text



def create_question(source_filename: str):
    # Prepare the DB.
    #embedding_function = get_embedding_function()
    path = f"{source_filename}.pdf"
    pdf_chroma_path = os.path.join(CHROMA_PATH, path)
    db = Chroma(persist_directory=pdf_chroma_path, embedding_function=FastEmbedEmbeddings())

    # Search the DB.
    #results = db.similarity_search_with_score(query_text, k=5)
    
    all_results = db.get()

    # Extract the text content from the retrieved documents
    context_text = "\n\n---\n\n".join(all_results["documents"])
    
    #context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE_1)
    prompt = prompt_template.format(context=context_text)
    # #print(prompt)

    # #model = Ollama(model="mistral")
    # #response_text = model.invoke(prompt)
    llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.5,
            api_key = "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"
        )
    response_text = llm.invoke(prompt).content
    parts = response_text.split("###")
    global answer
    if len(parts) == 2:
        question = parts[0].strip()
        answer = parts[1].strip()
    
    print(question)
    #print(answer)
    return question



def analyse(ans: str):
    
    #context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE_2)
    prompt = prompt_template.format(context= ans , context2 = answer)
    # #print(prompt)

    # #model = Ollama(model="mistral")
    # #response_text = model.invoke(prompt)
    llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.5,
            api_key = "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"
        )
    response_text = llm.invoke(prompt).content
    
    print(response_text)
    #print(answer)
    return response_text



if __name__ == "__main__":
    main()