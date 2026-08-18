import os
import joblib
import json
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.ml.model_registry import MODEL_REGISTRY

class ModelLoader:
    _instance = None
    _models: Dict[str, Any] = {}
    _metadata: Dict[str, Any] = {}
    _loaded_status: Dict[str, bool] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
        return cls._instance

    def load_all_models(self) -> None:
        """
        Loads all production ML pipelines once during application startup.
        """
        logger.info("Initializing ModelLoader singleton...")
        
        # Base folder containing trained_models
        base_dir = os.path.dirname(settings.MODEL_DIRECTORY)
        if not os.path.exists(settings.MODEL_DIRECTORY):
            # Fallback to local project trained_models directory
            base_dir = r"c:\Users\amman\Downloads\New folder"

        for model_id, reg_info in MODEL_REGISTRY.items():
            rel_model_path = reg_info["artifact_path"]
            rel_meta_path = reg_info["metadata_path"]

            abs_model_path = os.path.join(base_dir, rel_model_path)
            abs_meta_path = os.path.join(base_dir, rel_meta_path)

            if not os.path.exists(abs_model_path):
                logger.error(f"❌ Model artifact file not found: {abs_model_path}")
                self._loaded_status[model_id] = False
                continue

            try:
                pipeline = joblib.load(abs_model_path)
                self._models[model_id] = pipeline
                
                if os.path.exists(abs_meta_path):
                    with open(abs_meta_path, 'r', encoding='utf-8') as f:
                        meta_data = json.load(f)
                    self._metadata[model_id] = meta_data
                else:
                    self._metadata[model_id] = reg_info

                self._loaded_status[model_id] = True
                logger.info(f"✅ Successfully loaded {reg_info['model_name']} ({reg_info['algorithm']}) from {abs_model_path}")
            except Exception as e:
                logger.error(f"❌ Error loading model {model_id}: {e}")
                self._loaded_status[model_id] = False

    def get_model(self, model_id: str) -> Optional[Any]:
        return self._models.get(model_id)

    def get_metadata(self, model_id: str) -> Optional[Dict[str, Any]]:
        return self._metadata.get(model_id)

    def is_model_loaded(self, model_id: str) -> bool:
        return self._loaded_status.get(model_id, False)

    def get_all_status(self) -> Dict[str, Dict[str, Any]]:
        status_dict = {}
        for model_id, reg_info in MODEL_REGISTRY.items():
            status_dict[model_id] = {
                "model_id": model_id,
                "model_name": reg_info["model_name"],
                "algorithm": reg_info["algorithm"],
                "task": reg_info["task"],
                "version": reg_info["version"],
                "loaded": self.is_model_loaded(model_id),
                "metrics": reg_info["metrics"]
            }
        return status_dict

model_loader = ModelLoader()
