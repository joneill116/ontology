from abc import ABC, abstractmethod

class OntologyPersistence(ABC):
    @abstractmethod
    def load(self, graph):
        pass

    @abstractmethod
    def save(self, graph):
        pass

class FileOntologyPersistence(OntologyPersistence):
    def __init__(self, file_path):
        self.file_path = file_path

    def load(self, graph):
        try:
            graph.parse(self.file_path, format="turtle")
        except Exception:
            pass

    def save(self, graph):
        graph.serialize(destination=self.file_path, format="turtle")
