/**
 * E2E proof of the auto-SEO loop against the REAL crm.db:
 * generate month → pick a topic → draft body (EN) → edit title → publish →
 * list published. Run: npx tsx scripts/e2e-autoseo.mts
 */
import {
  generateMonth,
  generateArticleBody,
  editTopicVariant,
  publishTopic,
  listPublishedPosts,
} from "../src/lib/crm/services/content";

async function main() {
  const now = new Date();
  const cal = await generateMonth({ year: now.getFullYear(), month: now.getMonth() + 1 });
  console.log(`calendar: ${cal.topics.length} topics for ${cal.year}-${cal.month}`);
  const topic = cal.topics[0];
  console.log(`topic: "${topic.variants.find((v) => v.locale === "en")?.title}" [${topic.keyword}]`);

  const drafted = await generateArticleBody(topic.id, "en");
  console.log(`body: ${drafted?.body ? drafted.body.split(/\s+/).length + " words" : "FAILED"}`);

  const edited = await editTopicVariant(topic.id, "en", {
    title: (drafted?.title ?? "Article") + " — Proofread",
  });
  console.log(`edit: title now "${edited?.variants.find((v) => v.locale === "en")?.title}"`);

  const posts = await publishTopic(topic.id);
  console.log(`published: ${posts.length} post(s)`);
  for (const p of posts) console.log(`  -> /${p.locale}/blog/${p.category}/${p.slug}`);

  const listed = await listPublishedPosts();
  console.log(`listPublishedPosts: ${listed.length} total`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("E2E FAILED:", e);
  process.exit(1);
});
