import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ProductCategory,
  ProductPendingStatus
} from '../../../../Interfaces/iproduct';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../Services/product.service';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {
  form: FormGroup;
  categories = Object.values(ProductCategory);
  status = ProductPendingStatus;
  submitting = false;

  selectedImageFile: File | null = null;
  selectedImagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    const techCompanyId = localStorage.getItem('techCompanyId');

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      subCategoryName: [''],
      discountPrice: [0],
      image1Url: [''], // will receive base64
      techCompanyId: [techCompanyId || '', Validators.required],
      category: [ProductCategory.Motherboard, Validators.required],
      status: [ProductPendingStatus.Pending],
      specifications: this.fb.array([]),
      warranties: this.fb.array([])
    });

    if (!techCompanyId) {
      this.toastr.error('Admin ID not found in local storage.');
    }
  }

  get specifications(): FormArray {
    return this.form.get('specifications') as FormArray;
  }

  get warranties(): FormArray {
    return this.form.get('warranties') as FormArray;
  }

  addSpecification() {
    this.specifications.push(
      this.fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required]
      })
    );
  }

  removeSpecification(index: number) {
    this.specifications.removeAt(index);
  }

  addWarranty() {
    this.warranties.push(
      this.fb.group({
        type: ['', Validators.required],
        duration: ['', Validators.required],
        description: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      })
    );
  }

  removeWarranty(index: number) {
    this.warranties.removeAt(index);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.toastr.error('Selected file is not an image.');
      return;
    }

    this.selectedImageFile = file;

    // Convert to base64 for embedding in DTO
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.selectedImagePreview = base64;
      this.form.patchValue({ image1Url: base64 });
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.selectedImageFile = null;
    this.selectedImagePreview = null;
    this.form.patchValue({ image1Url: '' });
    const fileInput = document.getElementById('imageFile') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  }

  onSubmit() {
    if (this.form.invalid) return;

    // You can enforce presence if image is required:
    if (!this.form.value.image1Url) {
      this.toastr.error('Please pick a product image.'); 
      return;
    }

    this.submitting = true;

    const { category, status, warranties, ...dto } = this.form.value;

    const formattedWarranties = warranties.map((w: any) => ({
      ...w,
      startDate: new Date(w.startDate).toISOString(),
      endDate: new Date(w.endDate).toISOString()
    }));

    const payload: any = {
      ...dto,
      warranties: formattedWarranties
    };

    this.productService.addProduct(payload, category, status).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success(res.message);
        this.form.reset({
          price: 0,
          stock: 0,
          discountPrice: 0,
          category: ProductCategory.Motherboard,
          status: ProductPendingStatus.Pending
        });
        this.specifications.clear();
        this.warranties.clear();
        this.clearImage();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error?.message || 'Something went wrong');
      },
      complete: () => (this.submitting = false)
    });
  }
}
