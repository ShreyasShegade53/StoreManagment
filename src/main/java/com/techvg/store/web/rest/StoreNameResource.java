package com.techvg.store.web.rest;

import com.techvg.store.domain.StoreName;
import com.techvg.store.repository.StoreNameRepository;
import com.techvg.store.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.techvg.store.domain.StoreName}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StoreNameResource {

    private final Logger log = LoggerFactory.getLogger(StoreNameResource.class);

    private static final String ENTITY_NAME = "storeName";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StoreNameRepository storeNameRepository;

    public StoreNameResource(StoreNameRepository storeNameRepository) {
        this.storeNameRepository = storeNameRepository;
    }

    /**
     * {@code POST  /store-names} : Create a new storeName.
     *
     * @param storeName the storeName to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new storeName, or with status {@code 400 (Bad Request)} if the storeName has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/store-names")
    public ResponseEntity<StoreName> createStoreName(@RequestBody StoreName storeName) throws URISyntaxException {
        log.debug("REST request to save StoreName : {}", storeName);
        if (storeName.getId() != null) {
            throw new BadRequestAlertException("A new storeName cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StoreName result = storeNameRepository.save(storeName);
        return ResponseEntity
            .created(new URI("/api/store-names/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /store-names/:id} : Updates an existing storeName.
     *
     * @param id the id of the storeName to save.
     * @param storeName the storeName to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated storeName,
     * or with status {@code 400 (Bad Request)} if the storeName is not valid,
     * or with status {@code 500 (Internal Server Error)} if the storeName couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/store-names/{id}")
    public ResponseEntity<StoreName> updateStoreName(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StoreName storeName
    ) throws URISyntaxException {
        log.debug("REST request to update StoreName : {}, {}", id, storeName);
        if (storeName.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, storeName.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeNameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StoreName result = storeNameRepository.save(storeName);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, storeName.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /store-names/:id} : Partial updates given fields of an existing storeName, field will ignore if it is null
     *
     * @param id the id of the storeName to save.
     * @param storeName the storeName to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated storeName,
     * or with status {@code 400 (Bad Request)} if the storeName is not valid,
     * or with status {@code 404 (Not Found)} if the storeName is not found,
     * or with status {@code 500 (Internal Server Error)} if the storeName couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/store-names/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StoreName> partialUpdateStoreName(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StoreName storeName
    ) throws URISyntaxException {
        log.debug("REST request to partial update StoreName partially : {}, {}", id, storeName);
        if (storeName.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, storeName.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeNameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StoreName> result = storeNameRepository
            .findById(storeName.getId())
            .map(existingStoreName -> {
                if (storeName.getName() != null) {
                    existingStoreName.setName(storeName.getName());
                }

                return existingStoreName;
            })
            .map(storeNameRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, storeName.getId().toString())
        );
    }

    /**
     * {@code GET  /store-names} : get all the storeNames.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of storeNames in body.
     */
    @GetMapping("/store-names")
    public List<StoreName> getAllStoreNames() {
        log.debug("REST request to get all StoreNames");
        return storeNameRepository.findAll();
    }

    /**
     * {@code GET  /store-names/:id} : get the "id" storeName.
     *
     * @param id the id of the storeName to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the storeName, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/store-names/{id}")
    public ResponseEntity<StoreName> getStoreName(@PathVariable Long id) {
        log.debug("REST request to get StoreName : {}", id);
        Optional<StoreName> storeName = storeNameRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(storeName);
    }

    /**
     * {@code DELETE  /store-names/:id} : delete the "id" storeName.
     *
     * @param id the id of the storeName to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/store-names/{id}")
    public ResponseEntity<Void> deleteStoreName(@PathVariable Long id) {
        log.debug("REST request to delete StoreName : {}", id);
        storeNameRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
