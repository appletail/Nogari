package me.nogari.nogari.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGithub is a Querydsl query type for Github
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QGithub extends EntityPathBase<Github> {

    private static final long serialVersionUID = 169818264L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGithub github = new QGithub("github");

    public final QBaseTimeEntity _super = new QBaseTimeEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    public final StringPath filename = createString("filename");

    public final NumberPath<Long> githubId = createNumber("githubId", Long.class);

    public final StringPath link = createString("link");

    public final QMember member;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final StringPath repository = createString("repository");

    public final StringPath status = createString("status");

    public QGithub(String variable) {
        this(Github.class, forVariable(variable), INITS);
    }

    public QGithub(Path<? extends Github> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGithub(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGithub(PathMetadata metadata, PathInits inits) {
        this(Github.class, metadata, inits);
    }

    public QGithub(Class<? extends Github> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member"), inits.get("member")) : null;
    }

}

