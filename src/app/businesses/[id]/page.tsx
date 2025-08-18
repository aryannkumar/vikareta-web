import Image from 'next/image';
import Link from 'next/link';
import { marketplaceApi } from '@/lib/api/marketplace';
import { productsApi } from '@/lib/api/products';
import { servicesApi } from '@/lib/api/services';
import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function BusinessProfilePage(props: any) {
  const id = props?.params?.id as string;

  // Fetch the business directly by id
  const [businessRes, productsRes, servicesRes] = await Promise.all([
    marketplaceApi.getBusinessById(id),
    productsApi.getProducts({ supplierId: id, limit: 8 } as any),
    servicesApi.getServices({ businessId: id, limit: 8 } as any)
  ]);

  // If direct fetch failed, try a fallback by scanning nearby businesses
  let business = businessRes && businessRes.success && businessRes.data ? businessRes.data : null;
  if (!business) {
    try {
      const nearby = await marketplaceApi.getNearbyBusinesses();
      if (nearby && nearby.success && Array.isArray(nearby.data)) {
        business = nearby.data.find((b: any) => String(b.id) === String(id)) || null;
      }
    } catch {
      // ignore
    }
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-2xl font-semibold">Business not found</div>
          <p className="text-gray-600 mt-2">We couldn't find this business. It may have been removed or its details are unavailable.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="/businesses" className="px-4 py-2 bg-orange-600 text-white rounded-lg">Back to directory</a>
            <button onClick={async () => { await marketplaceApi.getPopularBusinesses(); }} className="px-4 py-2 border rounded-lg">Retry lookup</button>
          </div>
        </div>
      </div>
    );
  }

  const products = productsRes && productsRes.success ? (productsRes.data?.products || productsRes.data || []) : [];
  const services = servicesRes && servicesRes.success ? (servicesRes.data?.services || servicesRes.data || []) : [];

  const address = business.address || business.location || business.provider?.location || '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md">
          <div className="relative h-64 w-full">
            {business.coverImage ? (
              <Image src={business.coverImage} alt={business.name} fill className="object-cover" />
            ) : (
              <div className="h-64 w-full bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 flex items-center justify-center"> 
                <div className="text-2xl font-semibold text-orange-600 dark:text-orange-300">{business.name}</div>
              </div>
            )}

            <div className="absolute -bottom-12 left-8 flex items-center gap-4">
              <div className="h-28 w-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold overflow-hidden">
                {business.logo ? (
                  <Image src={business.logo} alt={business.name} width={112} height={112} className="object-cover" />
                ) : (
                  <div className="text-3xl">{(business.name || 'B').charAt(0)}</div>
                )}
              </div>

              <div className="ml-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{business.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {business.isVerified || business.provider?.verified ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">Verified</Badge>
                  ) : null}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-gray-700 dark:text-gray-300">{business.description || 'No description available.'}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Products</h3>
                  {products.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No products listed.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((p: any) => (
                        <Link key={p.id} href={`/products/${p.id}`} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                          <img src={p.images?.[0] || '/img/placeholder-product.jpg'} alt={p.name} className="w-20 h-20 object-cover rounded-md" />
                          <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-sm text-gray-500">{p.price ? `₹${p.price}` : 'Price on request'}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Services</h3>
                  {services.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No services listed.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((s: any) => (
                        <Link key={s.id} href={`/services/${s.id}`} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                          <img src={s.images?.[0] || '/img/placeholder-service.jpg'} alt={s.name} className="w-20 h-20 object-cover rounded-md" />
                          <div>
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-sm text-gray-500">{s.basePrice ? `₹${s.basePrice}` : 'Price on request'}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Portfolio</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">No portfolio items available.</div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{business.contactEmail || 'Contact details are not available for this listing.'}</div>
                  <div className="mt-3 flex flex-col gap-2">
                    {business.phone ? (
                      <a href={`tel:${business.phone}`} className="w-full inline-flex items-center justify-center bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition"><Phone className="mr-2" />Call</a>
                    ) : null}
                    {business.website ? (
                      <a href={business.website} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center bg-transparent border border-gray-200 dark:border-gray-700 py-2 px-3 rounded-lg text-sm"><Globe className="mr-2" />Visit Website</a>
                    ) : null}
                    <button disabled={!business.contactEmail} onClick={() => { if (business.contactEmail) window.location.href = `mailto:${business.contactEmail}`; }} className="w-full py-2 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg">Email</button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold mb-2">Stats</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Rating: <span className="font-semibold">{business.rating || 0}</span> <Star className="h-4 w-4 inline-block text-yellow-400" /></div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Employees: <span className="font-semibold">{business.employeeCount || 0}</span></div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Products: <span className="font-semibold">{business.productsCount || 0}</span></div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <p className="text-gray-600 dark:text-gray-400">{(business.certifications && business.certifications.length) ? business.certifications.join(', ') : 'No certifications listed.'}</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
