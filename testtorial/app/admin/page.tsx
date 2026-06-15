// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  specifications?: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    specifications: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api?action=getProducts');
    const data = await res.json();
    setProducts(data);
    const uniqueCategories = [...new Set(data.map((p: Product) => p.category))];
    setCategories(uniqueCategories);
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api?action=logout', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setFormData({ ...formData, category: newCategory });
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', category: '', description: '', specifications: '', price: '', image: '' });
    setImagePreview('');
    setShowNewCategoryInput(false);
    setNewCategory('');
  };

  const handleCreateProduct = async () => {
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createProduct',
          name: formData.name,
          category: formData.category,
          description: formData.description,
          image: formData.image,
          specifications: formData.specifications,
          price: formData.price,
        }),
      });

      if (res.ok) {
        await fetchProducts();
        resetForm();
        return true;
      } else {
        const error = await res.json();
        alert(error.error || 'حدث خطأ في الإضافة');
        return false;
      }
    } catch (error) {
      alert('خطأ في الاتصال');
      return false;
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return false;
    
    try {
      const res = await fetch(`/api?action=updateProduct&id=${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateProduct',
          name: formData.name,
          category: formData.category,
          description: formData.description,
          image: formData.image,
          specifications: formData.specifications,
          price: formData.price,
        }),
      });

      if (res.ok) {
        await fetchProducts();
        resetForm();
        return true;
      } else {
        const error = await res.json();
        alert(error.error || 'حدث خطأ في التحديث');
        return false;
      }
    } catch (error) {
      alert('خطأ في الاتصال');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let success = false;
    if (editingProduct) {
      success = await handleUpdateProduct();
    } else {
      success = await handleCreateProduct();
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const res = await fetch(`/api?action=deleteProduct&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      specifications: product.specifications || '',
      price: product.price?.toString() || '',
      image: product.image,
    });
    setImagePreview(product.image);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-md border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition font-medium"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="text-gray-600 text-sm font-medium">إجمالي المنتجات</div>
            <div className="text-4xl font-bold text-gray-800 mt-2">{products.length}</div>
            <div className="text-gray-500 text-sm mt-1">منتج في المتجر</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="text-gray-600 text-sm font-medium">الفئات</div>
            <div className="text-4xl font-bold text-gray-800 mt-2">{categories.length}</div>
            <div className="text-gray-500 text-sm mt-1">فئة مختلفة</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="text-gray-600 text-sm font-medium">إجمالي القيمة</div>
            <div className="text-4xl font-bold text-gray-800 mt-2">
              {products.reduce((sum, p) => sum + (p.price || 0), 0)} ₪
            </div>
            <div className="text-gray-500 text-sm mt-1">قيمة المخزون</div>
          </div>
        </div>

        {/* زر إضافة منتج جديد */}
        <div className="mb-8">
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', category: '', description: '', specifications: '', price: '', image: '' });
              setImagePreview('');
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            + إضافة منتج جديد
          </button>
        </div>

       {/* Form */}
{showForm && (
  <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">
        {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
      </h2>
      <button
        onClick={resetForm}
        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ✕
      </button>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            اسم المنتج *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            الفئة *
          </label>
          <div className="flex gap-2">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            >
              <option value="">اختر فئة</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              {showNewCategoryInput ? 'إلغاء' : '+ فئة جديدة'}
            </button>
          </div>
          
          {showNewCategoryInput && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="أدخل اسم الفئة الجديدة"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                إضافة
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            السعر (₪ شيكل) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="مثال: 599"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            رابط الصورة (رابط خارجي أو مسار محلي) *
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            يمكنك استخدام أي رابط صورة من الإنترنت
          </p>
          {imagePreview && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 mb-2">معاينة الصورة:</p>
              <img 
                src={imagePreview} 
                alt="معاينة" 
                className="h-24 w-24 object-cover rounded mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=صورة+غير+موجودة';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* المواصفات - مساحة كبيرة (6 أسطر) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          المواصفات (تفاصيل المنتج التقنية)
        </label>
        <textarea
          value={formData.specifications}
          onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          placeholder="مثال: 8GB RAM, 256GB SSD, معالج Intel Core i7, بطارية 5000mAh..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <p className="text-xs text-gray-400 mt-1">
          اكتب المواصفات بالتفصيل (كل مواصفة في سطر جديد أو مفصولة بفواصل)
        </p>
      </div>

      {/* الوصف - مساحة صغيرة (3 أسطر) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          الوصف *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          وصف قصير للمنتج (سطرين أو ثلاثة)
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الحفظ...' : (editingProduct ? 'تحديث' : 'إضافة')}
        </button>
      </div>
    </form>
  </div>
)}

        {/* جدول المنتجات */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr className="text-right">
                  <th className="px-6 py-3 text-sm font-bold text-gray-700">#</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-700">المنتج</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-700">الفئة</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-700">السعر</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-700">الوصف</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      لا توجد منتجات حالياً. أضف منتج جديد باستخدام الزر أعلاه.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                            }}
                          />
                          <span className="font-semibold text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">{product.price} ₪</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{product.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded transition"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50 rounded transition"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}