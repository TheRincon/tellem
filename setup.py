import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="tellem",
    version="0.0.1",
    author="Rincon Rex",
    author_email="rinconrex@gmail.com",
    description="Google Maps expanded",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/TheRincon/tellem",
    packages=setuptools.find_packages(),
    install_requires=[],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
