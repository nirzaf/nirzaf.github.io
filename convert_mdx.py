import os
import markdown
import re

def convert_mdx_to_txt(source_directory, target_directory):
    """
    Converts all MDX files in a directory to plain text files.

    Args:
        source_directory (str): The path to the directory containing the MDX files.
        target_directory (str): The path to the directory where TXT files will be saved.
    """
    # Create target directory if it doesn't exist
    os.makedirs(target_directory, exist_ok=True)
    
    for filename in os.listdir(source_directory):
        if filename.endswith(".mdx"):
            mdx_path = os.path.join(source_directory, filename)
            txt_path = os.path.join(target_directory, os.path.splitext(filename)[0] + ".txt")

            try:
                with open(mdx_path, 'r', encoding='utf-8') as mdx_file:
                    mdx_content = mdx_file.read()

                    # Convert Markdown to HTML
                    html = markdown.markdown(mdx_content)

                    # Strip HTML tags to get plain text
                    # This regex removes anything that looks like an HTML tag
                    plain_text = re.sub('<[^<]+?>', '', html)

                with open(txt_path, 'w', encoding='utf-8') as txt_file:
                    txt_file.write(plain_text)

                print(f"Successfully converted {filename} to {os.path.basename(txt_path)}")

            except Exception as e:
                print(f"Error converting {filename}: {e}")

# --- Start Conversion ---
source_directory = '/Users/qts/Repos/nirzaf.github.io/data/posts/'
target_directory = '/Users/qts/Repos/nirzaf.github.io/blogs_txt/'
convert_mdx_to_txt(source_directory, target_directory)