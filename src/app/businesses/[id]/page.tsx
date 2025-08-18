import Image from 'next/image';
import Link from 'next/link';
import { providersApi, type Provider } from '@/lib/api/providers';
import { productsApi } from '@/lib/api/products';
import { servicesApi } from '@/lib/api/services';
import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function BusinessProfilePage(props: any) {
  const id = props?.params?.id as string;

  // Fetch provider, products and services server-side
  const [provRes, productsRes, servicesRes] = await Promise.all([
  providersApi.getProvider(id),
  productsApi.getProducts({ supplierId: id, limit: 6 } as any),
  servicesApi.getServices({ providerId: id, limit: 6 })
  ]);

  if (!provRes || !provRes.success || !provRes.data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center text-red-600">Business not found</div>
      </div>
    );
  }

  const provider = provRes.data as Provider;
  const products = productsRes && productsRes.success ? (productsRes.data?.products || []) : [];
  const services = servicesRes && servicesRes.success ? (servicesRes.data?.services || []) : [];

  const address = provider.contactInfo?.address ? `${provider.contactInfo.address.city}, ${provider.contactInfo.address.state}, ${provider.contactInfo.address.country}` : provider.location;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md">
          <div className="relative h-64 w-full">
            {provider.coverImage ? (
              <Image src={provider.coverImage} alt={provider.name} fill className="object-cover" />
            ) : (
              <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">No cover image</div>
            )}

            <div className="absolute -bottom-10 left-8 flex items-center gap-4">
              {provider.avatar ? (
                <Image src={provider.avatar} alt={provider.name} width={120} height={120} className="rounded-full border-4 border-white dark:border-gray-900 object-cover" />
              ) : (
                <div className="h-28 w-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold">{provider.name.charAt(0)}</div>
              )}

              <div className="ml-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{provider.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {provider.verified && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">Verified</Badge>
                  )}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-gray-700 dark:text-gray-300">{provider.description}</p>
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
                  <h3 className="text-lg font-semibold mb-3">Portfolio & Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {provider.portfolio && provider.portfolio.length > 0 ? (
                      provider.portfolio.map((pf) => (
                        <div key={pf.id} className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                          <div className="font-semibold">{pf.title}</div>
                          <div className="text-sm text-gray-500">{pf.category} • {pf.completedDate}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No portfolio items</p>
                    )}
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4" />
                    <span>{provider.contactInfo?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
                    <Globe className="h-4 w-4" />
                    <a href={provider.businessInfo?.website || '#'} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{provider.businessInfo?.website || 'Website'}</a>
                  </div>

                  <div className="mt-3">
                    <button className="btn-primary w-full py-2">Contact Business</button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold mb-2">Stats</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Rating: <span className="font-semibold">{provider.rating || 0}</span> <Star className="h-4 w-4 inline-block text-yellow-400" /></div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Projects: <span className="font-semibold">{provider.completedProjects || 0}</span></div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Response Time: <span className="font-semibold">{provider.responseTime || '-'}</span></div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  {provider.certifications && provider.certifications.length > 0 ? (
                    provider.certifications.map((c) => (
                      <div key={c.id} className="text-sm text-gray-600 dark:text-gray-300">{c.name} • {c.issuer}</div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No certifications listed.</p>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
