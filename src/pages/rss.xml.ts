// News section removed. RSS feed is disabled.
export async function GET() {
  return new Response('News feed has been removed.', {
    status: 410,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
