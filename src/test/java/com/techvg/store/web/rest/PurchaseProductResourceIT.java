package com.techvg.store.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techvg.store.IntegrationTest;
import com.techvg.store.domain.PurchaseProduct;
import com.techvg.store.repository.PurchaseProductRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PurchaseProductResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PurchaseProductResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final Integer DEFAULT_UNITS = 1;
    private static final Integer UPDATED_UNITS = 2;

    private static final String DEFAULT_FROM = "AAAAAAAAAA";
    private static final String UPDATED_FROM = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/purchase-products";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PurchaseProductRepository purchaseProductRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPurchaseProductMockMvc;

    private PurchaseProduct purchaseProduct;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseProduct createEntity(EntityManager em) {
        PurchaseProduct purchaseProduct = new PurchaseProduct()
            .name(DEFAULT_NAME)
            .category(DEFAULT_CATEGORY)
            .price(DEFAULT_PRICE)
            .units(DEFAULT_UNITS)
            .from(DEFAULT_FROM)
            .company(DEFAULT_COMPANY);
        return purchaseProduct;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseProduct createUpdatedEntity(EntityManager em) {
        PurchaseProduct purchaseProduct = new PurchaseProduct()
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .units(UPDATED_UNITS)
            .from(UPDATED_FROM)
            .company(UPDATED_COMPANY);
        return purchaseProduct;
    }

    @BeforeEach
    public void initTest() {
        purchaseProduct = createEntity(em);
    }

    @Test
    @Transactional
    void createPurchaseProduct() throws Exception {
        int databaseSizeBeforeCreate = purchaseProductRepository.findAll().size();
        // Create the PurchaseProduct
        restPurchaseProductMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isCreated());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeCreate + 1);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPurchaseProduct.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testPurchaseProduct.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(DEFAULT_UNITS);
        assertThat(testPurchaseProduct.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testPurchaseProduct.getCompany()).isEqualTo(DEFAULT_COMPANY);
    }

    @Test
    @Transactional
    void createPurchaseProductWithExistingId() throws Exception {
        // Create the PurchaseProduct with an existing ID
        purchaseProduct.setId(1L);

        int databaseSizeBeforeCreate = purchaseProductRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseProductMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPurchaseProducts() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        // Get all the purchaseProductList
        restPurchaseProductMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseProduct.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].units").value(hasItem(DEFAULT_UNITS)))
            .andExpect(jsonPath("$.[*].from").value(hasItem(DEFAULT_FROM)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)));
    }

    @Test
    @Transactional
    void getPurchaseProduct() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        // Get the purchaseProduct
        restPurchaseProductMockMvc
            .perform(get(ENTITY_API_URL_ID, purchaseProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(purchaseProduct.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.units").value(DEFAULT_UNITS))
            .andExpect(jsonPath("$.from").value(DEFAULT_FROM))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY));
    }

    @Test
    @Transactional
    void getNonExistingPurchaseProduct() throws Exception {
        // Get the purchaseProduct
        restPurchaseProductMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPurchaseProduct() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();

        // Update the purchaseProduct
        PurchaseProduct updatedPurchaseProduct = purchaseProductRepository.findById(purchaseProduct.getId()).get();
        // Disconnect from session so that the updates on updatedPurchaseProduct are not directly saved in db
        em.detach(updatedPurchaseProduct);
        updatedPurchaseProduct
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .units(UPDATED_UNITS)
            .from(UPDATED_FROM)
            .company(UPDATED_COMPANY);

        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPurchaseProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPurchaseProduct))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPurchaseProduct.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPurchaseProduct.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testPurchaseProduct.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testPurchaseProduct.getCompany()).isEqualTo(UPDATED_COMPANY);
    }

    @Test
    @Transactional
    void putNonExistingPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePurchaseProductWithPatch() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();

        // Update the purchaseProduct using partial update
        PurchaseProduct partialUpdatedPurchaseProduct = new PurchaseProduct();
        partialUpdatedPurchaseProduct.setId(purchaseProduct.getId());

        partialUpdatedPurchaseProduct.category(UPDATED_CATEGORY).units(UPDATED_UNITS).company(UPDATED_COMPANY);

        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseProduct))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPurchaseProduct.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPurchaseProduct.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testPurchaseProduct.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testPurchaseProduct.getCompany()).isEqualTo(UPDATED_COMPANY);
    }

    @Test
    @Transactional
    void fullUpdatePurchaseProductWithPatch() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();

        // Update the purchaseProduct using partial update
        PurchaseProduct partialUpdatedPurchaseProduct = new PurchaseProduct();
        partialUpdatedPurchaseProduct.setId(purchaseProduct.getId());

        partialUpdatedPurchaseProduct
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .price(UPDATED_PRICE)
            .units(UPDATED_UNITS)
            .from(UPDATED_FROM)
            .company(UPDATED_COMPANY);

        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseProduct))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPurchaseProduct.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPurchaseProduct.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testPurchaseProduct.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testPurchaseProduct.getCompany()).isEqualTo(UPDATED_COMPANY);
    }

    @Test
    @Transactional
    void patchNonExistingPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, purchaseProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePurchaseProduct() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeDelete = purchaseProductRepository.findAll().size();

        // Delete the purchaseProduct
        restPurchaseProductMockMvc
            .perform(delete(ENTITY_API_URL_ID, purchaseProduct.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
