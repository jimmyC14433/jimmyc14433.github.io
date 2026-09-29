/**
 * Script to automatically fetch badges from Credly profile and save to credly-badges.json
 */
const fs = require('fs');
const path = require('path');

const USERNAME = 'yimy-cristancho';
const CREDLY_URL = `https://www.credly.com/users/${USERNAME}/badges.json`;
const OUTPUT_FILE = path.join(__dirname, 'credly-badges.json');

async function updateCredlyBadges() {
    console.log(`[Credly Sync] Fetching badges for user: ${USERNAME}...`);
    try {
        const response = await fetch(CREDLY_URL);
        if (!response.ok) {
            throw new Error(`Credly responded with status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const rawBadges = data.data || [];
        console.log(`[Credly Sync] Found ${rawBadges.length} badges on Credly.`);

        const badges = rawBadges.map(b => {
            let issuerName = 'Credly Issuer';
            try {
                if (b.badge_template && b.badge_template.issuer && b.badge_template.issuer.entities && b.badge_template.issuer.entities.length > 0) {
                    issuerName = b.badge_template.issuer.entities[0].entity.name || b.badge_template.issuer.entities[0].label;
                }
            } catch (e) {}

            return {
                id: b.id,
                name: b.badge_template.name,
                image_url: b.image_url,
                issued_at_date: b.issued_at_date,
                issuer_name: issuerName,
                badge_url: `https://www.credly.com/badges/${b.id}`,
                description: b.badge_template.description || ''
            };
        });

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(badges, null, 4), 'utf8');
        console.log(`[Credly Sync] Successfully updated ${OUTPUT_FILE} with ${badges.length} badges!`);
    } catch (error) {
        console.error('[Credly Sync] Failed to update badges:', error);
        process.exit(1);
    }
}

updateCredlyBadges();
