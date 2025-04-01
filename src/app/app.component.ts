import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { list, getUrl } from '@aws-amplify/storage'; // Import from storage submodule

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  folders: string[] = [];
  images: { key: string; url: string }[] = [];
  openDecks: Set<string> = new Set();

  async ngOnInit() {
    try {
      // List all objects in the bucket
      const result = await list({
        path: '', // Empty path to list all objects in the bucket
      });

      // Extract unique folder names from the object keys
      const folderSet = new Set<string>();
      result.items.forEach((item) => {
        const folderPath = item.path.split('/')[0]; // Get the top-level folder
        if (folderPath) {
          folderSet.add(folderPath);
        }
      });

      this.folders = Array.from(folderSet);

      // Optionally, fetch images from all folders
      const imagePromises = result.items.map(async (item) => {
        const urlResult = await getUrl({
          path: item.path,
          options: { validateObjectExistence: true },
        });
        return { key: item.path, url: urlResult.url.toString() };
      });

      this.images = await Promise.all(imagePromises);
    } catch (error) {
      console.error('Error fetching folders or images:', error);
    }
  }

  toggleDeck(deck: string): void {
    if (this.openDecks.has(deck)) {
      this.openDecks.delete(deck);
    } else {
      this.openDecks.add(deck);
    }
  }

  isDeckOpen(deck: string): boolean {
    return this.openDecks.has(deck);
  }

}