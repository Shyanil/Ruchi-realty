import shutil
import os

src_dir = "/Users/shyanilmishra/.gemini/antigravity-ide/brain/c2d6aa70-7376-40e3-938b-e8602d395f71"
dest_dir = "uploads"

os.makedirs(dest_dir, exist_ok=True)

files = {
    "careers_hero_main_1782562921066.png": "careers_hero_main.png",
    "careers_hero_team_1782562939676.png": "careers_hero_team.png",
    "careers_hero_commercial_1782562961117.png": "careers_hero_commercial.png",
    "careers_culture_1782562981732.png": "careers_culture.png",
    "careers_final_cta_1782563008202.png": "careers_final_cta.png"
}

for src_name, dest_name in files.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    print(f"Copying {src_path} -> {dest_path}")
    shutil.copy(src_path, dest_path)
print("Finished copying all assets!")
